param(
    [string]$AppPoolName,
    [string]$SiteName,
    [string]$WebRoot,
    [string]$DeployBaseDir,
    [string]$TaggedVersion,
    [string]$Port,
    [string]$BindingHost,
    [String]$PfxPass 
)

Import-Module WebAdministration

# Function to Ensure Application Pool
function Test-AppPoolName {
    param ([string]$AppPoolName)
    try {
        if (Test-Path "IIS:\AppPools\$AppPoolName") {
            Write-Output "Application Pool '$AppPoolName' already exists."
        } else {
            Write-Output "Creating Application Pool: $AppPoolName"
            New-WebAppPool -Name $AppPoolName
            Set-ItemProperty IIS:\AppPools\$AppPoolName -Name managedRuntimeVersion -Value 'v4.0'
            Set-ItemProperty IIS:\AppPools\$AppPoolName -Name processModel.identityType -Value ApplicationPoolIdentity
        }
    } catch {
        Write-Output "Error ensuring Application Pool: $AppPoolName"
        Write-Output $_.Exception.Message
        exit 1
    }
}

# Function to Update IIS Website
function Update-IISWebsite {
    param ([string]$SiteName, [string]$WebRoot, [string]$BindingHost, [string]$AppPoolName)
    try {
        if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
            Write-Output "Updating existing IIS Website: $SiteName"
            Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $WebRoot
        } else {
            Write-Output "Creating new IIS Website: $SiteName"
            New-WebSite -Name $SiteName -PhysicalPath $WebRoot -ApplicationPool $AppPoolName -HostHeader $BindingHost
        }
    } catch {
        Write-Output "Error while updating/creating IIS Website: $SiteName"
        Write-Output $_.Exception.Message
        exit 1
    }
}

# Function to Configure HTTPS Binding
function Set-HTTPSBinding {
    param ([string]$SiteName, [string]$BindingHost, [string]$PfxPath, [SecureString]$SecurePassword)
    try {
        # Import SSL Certificate
        Write-Output "Importing SSL certificate from PFX file: $PfxPath"
        $cert = Import-PfxCertificate -FilePath $PfxPath -CertStoreLocation Cert:\LocalMachine\My -Password $SecurePassword
        $certThumbprint = $cert.Thumbprint
        Write-Output "Certificate imported successfully with Thumbprint: $certThumbprint"

        # Remove HTTP Binding
$httpBinding = Get-WebBinding -Name $SiteName -Protocol "http" -Port 80 -HostHeader $BindingHost -ErrorAction SilentlyContinue
if ($httpBinding) {
    Write-Output "Removing default HTTP binding."
    Remove-WebBinding -Name $SiteName -Protocol "http" -Port 80 -HostHeader $BindingHost
} else {
    Write-Output "No HTTP binding found for removal."
}

# Add HTTPS Binding
Write-Output "Adding HTTPS binding on port 443."
$httpsBinding = Get-WebBinding -Name $SiteName -Protocol "https" -Port 8443 -HostHeader $BindingHost -ErrorAction SilentlyContinue
if (-not $httpsBinding) {
    New-WebBinding -Name $SiteName -Protocol "https" -Port 8443 -HostHeader $BindingHost
} else {
    Write-Output "HTTPS binding already exists for $BindingHost on port 443."
}

# Assign SSL Certificate
$bindingInfo = Get-WebBinding -Name $SiteName -Protocol "https" | Where-Object { $_.bindingInformation -like "*:8443:$BindingHost" }
if ($bindingInfo) {
    $bindingInfo.AddSslCertificate($certThumbprint, "My")
    Write-Output "Successfully assigned SSL certificate to HTTPS binding."
} else {
    Write-Output "Failed to find HTTPS binding to assign SSL certificate."
}
        Write-Output "Successfully configured HTTPS binding for: $SiteName"
    } catch {
        Write-Output "Error configuring HTTPS binding for: $SiteName"
        Write-Output $_.Exception.Message
        exit 1
    }
}

# Ensure App Pool Exists
Test-AppPoolName -AppPoolName $AppPoolName

# Stop IIS Website Before Updating
try {
    if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
        Write-Output "Stopping IIS Website: $SiteName"
        Stop-WebSite -Name $SiteName
    }
} catch {
    Write-Output "Error stopping IIS Website: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}

# Ensure Web Root Exists
try {
    if (-not (Test-Path -Path $WebRoot)) {
        Write-Output "Creating Web Root: $WebRoot"
        New-Item -Path $WebRoot -ItemType Directory
    } else {
        Write-Output "Web Root already exists: $WebRoot"
    }
} catch {
    Write-Output "Error ensuring Web Root exists."
    Write-Output $_.Exception.Message
    exit 1
}

# Clean Web Root
try {
    Write-Output "Cleaning Web Root: $WebRoot"
    Remove-Item -Path "$WebRoot\*" -Recurse -Force
} catch {
    Write-Output "Error cleaning Web Root."
    Write-Output $_.Exception.Message
    exit 1
}

# Copy Build to Web Root
try {
    Write-Output "Copying build to Web Root: $WebRoot"
    Copy-Item -Path "$DeployBaseDir\$TaggedVersion\*" -Destination $WebRoot -Recurse -Force
} catch {
    Write-Output "Error copying build to Web Root."
    Write-Output $_.Exception.Message
    exit 1
}

# Update or Create IIS Website
Update-IISWebsite -SiteName $SiteName -WebRoot $WebRoot -BindingHost $BindingHost -AppPoolName $AppPoolName

# Configure HTTPS Binding
$pfxPath = "C:\Users\ABHI\Desktop\monolensssl2024.pfx"
$securePassword = ConvertTo-SecureString -String $PfxPass -AsPlainText -Force
Set-HTTPSBinding -SiteName $SiteName -BindingHost $BindingHost -PfxPath $pfxPath -SecurePassword $securePassword

# Start IIS Website
try {
    Write-Output "Starting IIS Website: $SiteName"
    Start-WebSite -Name $SiteName
} catch {
    Write-Output "Error starting IIS Website: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}
