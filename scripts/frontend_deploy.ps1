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

# Create or Update Application Pool
try {
    
    # Debugging: Output the application pool path to see if it matches
    Write-Output "Checking if Application Pool exists at IIS:\AppPools\$AppPoolName"
    # Ensure the IIS module is loaded
    Import-Module WebAdministration

    if (Test-Path "IIS:\AppPools\$AppPoolName") {
        Write-Output "Application Pool '$AppPoolName' already exists. Skipping creation."
    } else {
        Write-Output "Creating Application Pool: $AppPoolName"
        
        # Create the Application Pool with Force to override if it already exists
        New-WebAppPool -Name $AppPoolName
        Set-ItemProperty IIS:\\AppPools\\$AppPoolName -Name managedRuntimeVersion -Value 'v4.0'
        Set-ItemProperty IIS:\\AppPools\\$AppPoolName -Name processModel.identityType -Value ApplicationPoolIdentity
    }
} catch {
    Write-Output "Error while creating Application Pool: $AppPoolName"
    Write-Output $_.Exception.Message
    exit 1
}

# Stop and Remove IIS Website if Exists
try {
    if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
        Write-Output "Stopping and Removing Website: $SiteName"
        Stop-WebSite -Name $SiteName
        Remove-WebSite -Name $SiteName
    } else {
        Write-Output "Website not found, skipping stop and remove."
    }
} catch {
    Write-Output "Error while stopping/removing Website: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}

# Ensure Frontend Directory Exists (Web Root)
try {
    if (-Not (Test-Path -Path $WebRoot)) {
        Write-Output "Creating frontend directory: $WebRoot"
        New-Item -Path $WebRoot -ItemType Directory
    } else {
        Write-Output "Directory already exists: $WebRoot"
    }
} catch {
    Write-Output "Error while ensuring frontend directory exists."
    Write-Output $_.Exception.Message
    exit 1
}

# Clean up the Frontend Directory
try {
    Write-Output "Cleaning up frontend directory: $WebRoot"
    $lockedFiles = Get-Process | Where-Object {($_.Modules | Where-Object { $_.FileName -like "$WebRoot\\*"})}
    if ($lockedFiles) {
        Write-Output "Files are currently locked, cleanup skipped."
        exit 1
    } else {
        Remove-Item -Path "$WebRoot\\*" -Recurse -Force
    }
} catch {
    Write-Output "Error during cleanup:"
    Write-Output $_.Exception.Message
    exit 1
}

# Copy Latest Build to IIS Web Root Directory
try {
    Write-Output "Copying latest build to web root directory"
    if (-Not (Test-Path -Path $WebRoot)) {
        Write-Output "Error: Destination directory does not exist: $WebRoot"
        exit 1
    }
    Copy-Item -Path "$DeployBaseDir\\$TaggedVersion\\*" -Destination $WebRoot -Recurse -Force
} catch {
    Write-Output "Error while copying latest build to web root directory:"
    Write-Output $_.Exception.Message
    exit 1
}

# # Deploy New IIS Site
# try {
#     Write-Output "Creating new IIS website for: $SiteName"
#     New-WebSite -Name $SiteName -Port $Port -PhysicalPath $WebRoot -ApplicationPool $AppPoolName -HostHeader $BindingHost
# } catch {
#     Write-Output "Error while deploying new IIS site: $SiteName"
#     Write-Output $_.Exception.Message
#     exit 1
# }

# Path to the PFX certificate file
$pfxPath = "C:\Users\mozart\Desktop\monolensssl2024.pfx" 

# Validate the file path
if (-not (Test-Path $pfxPath)) {
    throw "The PFX file does not exist at the specified path: $pfxPath"
}

# Retrieve the pfxPassword from GitHub Secrets using the environment variable
#$pfxPassword = ConvertTo-SecureString $env:PFX_PASSWORD -AsPlainText -Force

# Function to convert plain text password to SecureString
# function ConvertTo-SecureStringFromPlainText {
#     param (
#         [string]$plainPass
#     )
#     return ConvertTo-SecureString -String $plainPassword -AsPlainText -Force
# }

# Deploy New IIS Site with HTTPS Binding
try {

    # Convert plaintext password to SecureString
    if (-not $PfxPass) {
        throw "PfxPassword parameter is null or not passed correctly."
    } else {
        Write-Output "PfxPassword received successfully."
    }

    $securePassword = ConvertTo-SecureString -String $PfxPass -AsPlainText -Force

    Write-Output "Importing SSL certificate from PFX file: $pfxPath"

    # Import the PFX certificate into the personal store
    $cert = Import-PfxCertificate -FilePath $pfxPath -CertStoreLocation Cert:\LocalMachine\My -Password $securePassword

    # Get the thumbprint of the imported certificate
    $certThumbprint = $cert.Thumbprint
    Write-Output "Certificate imported successfully with Thumbprint: $certThumbprint"

    Write-Output "Creating new IIS website for: $SiteName"

    # Create the website without bindings first (HTTP binding can be set if needed)
    #New-WebSite -Name $SiteName -PhysicalPath $WebRoot -ApplicationPool $AppPoolName

    # Add the HTTPS binding for the domain on port 443
    New-WebBinding -Name $SiteName -BindingInformation "*:443:" -Protocol "https"

    # Assign the SSL certificate to the binding
    $binding = Get-WebBinding -Name $SiteName -Protocol "https"
    $binding.AddSslCertificate($certThumbprint, "My")

    Write-Output "Successfully created IIS site and configured HTTPS binding for: $SiteName"
} catch {
    Write-Output "Error while deploying new IIS site: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}
