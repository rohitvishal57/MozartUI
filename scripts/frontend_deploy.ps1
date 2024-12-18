param(
    [string]$AppPoolName,
    [string]$SiteName,
    [string]$WebRoot,
    [string]$DeployBaseDir,
    [string]$TaggedVersion,
    [string]$Port
)

# Create or Update Application Pool
try {
    # Debugging: Output the application pool path to see if it matches
    Write-Output "Checking if Application Pool exists at IIS:\AppPools\$AppPoolName"
    # Ensure the IIS module is loaded
    Import-Module WebAdministration
    
    $apppool = "IIS:\AppPools\$AppPoolName"
    if (Test-Path $apppool) {
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

# Deploy New IIS Site
try {
    Write-Output "Creating new IIS website for: $SiteName"
    New-WebSite -Name $SiteName -Port $Port -PhysicalPath $WebRoot -ApplicationPool $AppPoolName
} catch {
    Write-Output "Error while deploying new IIS site: $SiteName"
    Write-Output $_.Exception.Message
    exit 1
}
