param(
    [string]$AppPoolName,
    [string]$SiteName,
    [string]$WebRoot,
    [string]$DeployBaseDir,
    [string]$TaggedVersion,
    [string]$Port = "4453"
)

Import-Module WebAdministration

# Function to Ensure Application Pool
function Test-AppPoolName {
    param ([string]$AppPoolName)
    try {
        if (Test-Path "IIS:\AppPools\$AppPoolName") {
            Write-Output "Application Pool '$AppPoolName' already exists."
        }
        else {
            Write-Output "Creating Application Pool: $AppPoolName"
            New-WebAppPool -Name $AppPoolName
            Set-ItemProperty IIS:\AppPools\$AppPoolName -Name managedRuntimeVersion -Value 'v4.0'
            Set-ItemProperty IIS:\AppPools\$AppPoolName -Name processModel.identityType -Value ApplicationPoolIdentity
        }
    }
    catch {
        Write-Output "Error ensuring Application Pool: $AppPoolName"
        Write-Output $_.Exception.Message
        exit 1
    }
}

# Function to Update IIS Website
function Update-IISWebsite {
    param ([string]$SiteName, [string]$WebRoot, [string]$AppPoolName, [string]$Port)
    try {
        if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
            Write-Output "Updating existing IIS Website: $SiteName"
            Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $WebRoot
        }
        else {
            Write-Output "Creating new IIS Website: $SiteName"
            New-WebSite -Name $SiteName -PhysicalPath $WebRoot -ApplicationPool $AppPoolName -Port $Port
        }
    }
    catch {
        Write-Output "Error while updating/creating IIS Website: $SiteName"
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
}
catch {
    Write-Output "Error stopping IIS Website: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}

# Ensure Web Root Exists
try {
    if (-not (Test-Path -Path $WebRoot)) {
        Write-Output "Creating Web Root: $WebRoot"
        New-Item -Path $WebRoot -ItemType Directory
    }
    else {
        Write-Output "Web Root already exists: $WebRoot"
    }
}
catch {
    Write-Output "Error ensuring Web Root exists."
    Write-Output $_.Exception.Message
    exit 1
}

# Clean Web Root
try {
    Write-Output "Cleaning Web Root: $WebRoot"
    Remove-Item -Path "$WebRoot\*" -Recurse -Force
}
catch {
    Write-Output "Error cleaning Web Root."
    Write-Output $_.Exception.Message
    exit 1
}

# Copy Build to Web Root
try {
    Write-Output "Copying build to Web Root: $WebRoot"
    Copy-Item -Path "$DeployBaseDir\$TaggedVersion\*" -Destination $WebRoot -Recurse -Force
}
catch {
    Write-Output "Error copying build to Web Root."
    Write-Output $_.Exception.Message
    exit 1
}

# Update or Create IIS Website
Update-IISWebsite -SiteName $SiteName -WebRoot $WebRoot -AppPoolName $AppPoolName -Port $Port

# Start IIS Website
try {
    Write-Output "Starting IIS Website: $SiteName"
    Start-WebSite -Name $SiteName
}
catch {
    Write-Output "Error starting IIS Website: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}