# Malware details
MALWARE_DETAILS = {
    1: {  # Ramnit
        "behaviour": [
            "Attempts to establish persistence on system startup",
            "Steals browser cookies and credentials",
            "Injects malicious code into running processes",
            "Downloads additional malicious payloads",
            "Communicates with remote command and control servers",
            "Spreads via removable drives and network shares",
            "Disables security software",
            "Modifies system registry entries",
            "Collects sensitive information from the system",
            "Attempts to evade detection using obfuscation",
            "Can execute files from the system without user consent",
            "Uses code injection to disable critical processes",
            "Alters system startup routines to persist",
            "Deletes or corrupts backup data to avoid recovery",
            "May block access to security websites"
        ],
        "recommended_action": [
            "Disconnect the infected device from the network immediately.",
            "Run a full system scan with updated antivirus software.",
            "Change all passwords after malware removal.",
            "Check for unauthorized changes in system settings.",
            "Update your operating system and all installed applications.",
            "Restore affected files from a clean backup if possible.",
            "Monitor financial accounts for suspicious activity.",
            "Remove any unknown startup entries.",
            "Enable a firewall and monitor outgoing connections.",
            "Consult a cybersecurity professional if infection persists.",
            "Check for signs of data exfiltration and take action.",
            "Disable any unauthorized scheduled tasks.",
            "Investigate and clean any modified system files.",
            "Review network traffic for suspicious activity.",
            "Educate users about avoiding phishing and social engineering."
        ]
    },
    2: {  # Lollipop
        "behaviour": [
            "Displays unwanted advertisements and pop-ups",
            "Redirects browser searches to malicious sites",
            "Collects browsing history and user data",
            "Installs additional unwanted software",
            "Alters browser settings without consent",
            "Slows down system performance",
            "May install toolbars or extensions",
            "Generates fake system alerts",
            "Attempts to evade ad-blockers",
            "Persists by modifying browser shortcuts",
            "May hijack default search engine settings",
            "Changes default homepage to malicious sites",
            "Uses browser hooks to collect browsing activity",
            "Tracks and records user clicks on ads",
            "Attempts to install rogue applications from pop-ups"
        ],
        "recommended_action": [
            "Remove suspicious browser extensions and toolbars.",
            "Reset browser settings to default.",
            "Run a reputable adware removal tool.",
            "Clear browser cache and cookies.",
            "Avoid downloading software from untrusted sources.",
            "Update your browser and plugins.",
            "Educate users about safe browsing practices.",
            "Block pop-ups and suspicious ads in browser settings.",
            "Uninstall unknown or recently added programs.",
            "Perform regular scans for adware and PUPs.",
            "Review and clean browser cache, history, and cookies.",
            "Monitor for signs of unauthorized software installation.",
            "Ensure the operating system and browser settings are properly configured.",
            "Enable browser sandboxing for additional protection.",
            "Implement a browser lockdown mode for sensitive tasks."
        ]
    },
    3: {  # Kelihos_ver3
        "behaviour": [
            "Joins the infected device to a botnet",
            "Sends out spam emails from infected hosts",
            "Steals login credentials and sensitive data",
            "Downloads and executes additional malware",
            "Communicates with a decentralized peer-to-peer network",
            "Uses encryption to hide network traffic",
            "Harvests email addresses from the system",
            "Installs proxy servers for malicious use",
            "Attempts to disable security software",
            "Can update itself to evade detection",
            "Uses social engineering tactics to spread",
            "Disables firewalls and network security protocols",
            "Uses rootkit techniques to avoid detection",
            "Records keystrokes and captures sensitive information",
            "Establishes backdoor access to the compromised system"
        ],
        "recommended_action": [
            "Disconnect device from the internet to stop botnet activity.",
            "Run a comprehensive antivirus and anti-malware scan.",
            "Change all passwords after cleaning the system.",
            "Monitor outgoing network traffic for suspicious connections.",
            "Block known Kelihos command and control IPs.",
            "Update all installed software and operating system.",
            "Educate users on phishing and social engineering risks.",
            "Restore system from a clean backup if available.",
            "Report the infection to relevant authorities.",
            "Implement network segmentation to limit spread.",
            "Perform a full password audit across the organization.",
            "Ensure network traffic is encrypted using secure protocols.",
            "Isolate infected systems from critical infrastructure.",
            "Enable two-factor authentication for important accounts.",
            "Monitor email activity for unusual sending behavior."
        ]
    },
    4: {  # Vundo
        "behaviour": [
            "Injects malicious code into legitimate processes",
            "Displays fake security alerts and pop-ups",
            "Downloads and installs additional malware",
            "Modifies browser settings and homepages",
            "Attempts to disable antivirus software",
            "Creates multiple copies of itself on the system",
            "Collects personal and financial information",
            "Establishes persistence via registry modifications",
            "Uses rootkit techniques to hide its presence",
            "Communicates with remote servers for instructions",
            "Hijacks legitimate processes for malicious activity",
            "Steals sensitive user data, including credit card information",
            "Displays fake software updates to trick users into downloading",
            "May attempt to take control of the system remotely",
            "Attempts to block system restore functionality"
        ],
        "recommended_action": [
            "Use a dedicated Vundo removal tool or updated antivirus.",
            "Disconnect from the internet during malware removal.",
            "Check and clean browser settings and extensions.",
            "Restore altered registry entries to default values.",
            "Update all security software before scanning.",
            "Monitor for unusual system behavior after cleaning.",
            "Change passwords for sensitive accounts.",
            "Educate users about fake security alerts.",
            "Avoid downloading attachments from unknown sources.",
            "Consult IT support for persistent infections.",
            "Run a memory dump analysis to detect hidden processes.",
            "Revert any unauthorized system configuration changes.",
            "Ensure full system backups are available before proceeding.",
            "Enable rootkit detection during antivirus scans.",
            "Limit the use of administrator privileges during cleanup."
        ]
    },
    5: {  # Simda
        "behaviour": [
            "Spreads rapidly through network vulnerabilities",
            "Downloads and installs other malware components",
            "Modifies system files and settings",
            "Steals system and user credentials",
            "Disables security features and updates",
            "Uses rootkit techniques to avoid detection",
            "Contacts remote servers for updates",
            "Creates hidden user accounts",
            "Attempts lateral movement within networks",
            "Deletes logs to cover its tracks",
            "May attempt to exploit unpatched vulnerabilities",
            "Hijacks network traffic to capture sensitive data",
            "Installs keyloggers to capture user input",
            "Injects malicious code into other running applications",
            "Can disable remote access security features"
        ],
        "recommended_action": [
            "Isolate infected systems from the network immediately.",
            "Apply all critical security patches and updates.",
            "Perform a full system scan with reputable antivirus.",
            "Check for unauthorized user accounts and remove them.",
            "Restore system files from clean backups.",
            "Monitor network for unusual activity.",
            "Educate users on safe computing practices.",
            "Enable and configure firewalls properly.",
            "Review and secure remote access settings.",
            "Consult with cybersecurity experts for remediation.",
            "Use endpoint protection software with behavioral analysis.",
            "Review and clean application logs for signs of compromise.",
            "Implement network intrusion detection and prevention systems.",
            "Ensure strong password policies and multifactor authentication.",
            "Audit system permissions and access controls."
        ]
    },
    6: {  # Tracur
        "behaviour": [
            "Acts as a trojan dropper for other malware",
            "Modifies browser settings and search results",
            "Downloads and executes malicious payloads",
            "Attempts to evade detection by security software",
            "Collects sensitive user data",
            "Injects ads into web pages",
            "Alters system registry entries",
            "Communicates with remote servers for instructions",
            "Can disable certain system functions",
            "Persists by creating scheduled tasks",
            "Changes DNS settings to redirect traffic",
            "Hides in the background to avoid detection",
            "Can capture keystrokes and clipboard data",
            "May attempt to disable Windows security features",
            "Injects rogue code into browsers to track activity"
        ],
        "recommended_action": [
            "Run a full system scan with updated antivirus.",
            "Remove unknown scheduled tasks and registry entries.",
            "Reset browser settings to default.",
            "Update all security software.",
            "Avoid clicking on suspicious links or downloads.",
            "Educate users about phishing and drive-by downloads.",
            "Monitor system for recurring infections.",
            "Restore affected files from backup if needed.",
            "Block known malicious domains and IPs.",
            "Consult IT support for thorough cleanup.",
            "Enable automatic updates to secure software.",
            "Check DNS settings for unauthorized changes.",
            "Use a web browser sandbox to isolate suspicious activity.",
            "Implement DNS filtering for network traffic.",
            "Track all scheduled task creation and modifications."
        ]
    },
    7: {  # Kelihos_ver1
        "behaviour": [
            "Joins infected device to a spam-sending botnet",
            "Steals email addresses and credentials",
            "Downloads and executes additional malware",
            "Uses peer-to-peer communication for control",
            "Installs proxy servers for malicious activity",
            "Attempts to disable security software",
            "Harvests sensitive information from the system",
            "Can update itself to avoid detection",
            "Uses encryption to hide communications",
            "Spreads via removable media",
            "May send spam emails with malicious attachments",
            "Exploits unpatched vulnerabilities to spread",
            "May disable firewall protection",
            "Logs user activity for further exploitation",
            "Utilizes social engineering techniques to increase spread"
        ],
        "recommended_action": [
            "Disconnect from the network to prevent spam activity.",
            "Run a comprehensive antivirus scan.",
            "Change all passwords after infection is cleared.",
            "Monitor outgoing email traffic for anomalies.",
            "Block known command and control servers.",
            "Update operating system and all applications.",
            "Educate users about email security.",
            "Restore from clean backups if possible.",
            "Implement network monitoring for botnet activity.",
            "Report infection to IT and relevant authorities.",
            "Perform a full audit of all user accounts and activity.",
            "Enable email filtering and anti-phishing measures.",
            "Review firewall rules and network access control.",
            "Ensure antivirus signatures are up to date.",
            "Perform regular penetration testing to check for vulnerabilities."
        ]
    },
    8: {  # Obfuscator.ACY
        "behaviour": [
            "Uses code obfuscation to evade detection",
            "Encrypts or hides malicious payloads",
            "Modifies file attributes and names",
            "Injects code into legitimate processes",
            "Attempts to bypass antivirus software",
            "Downloads and executes hidden malware",
            "Alters system registry for persistence",
            "Communicates with remote servers",
            "May disable security features",
            "Can be used to pack other malware types",
            "Runs in the background to avoid detection",
            "Uses code injection to hijack system operations",
            "Attempts to evade detection using polymorphic techniques",
            "May use exploits to inject malicious payloads",
            "Installs hidden files in system directories"
        ],
        "recommended_action": [
            "Use advanced malware removal tools.",
            "Update antivirus definitions and scan thoroughly.",
            "Monitor for suspicious processes and file changes.",
            "Restore altered system settings and files.",
            "Educate users about risks of unknown downloads.",
            "Block execution of unknown or suspicious files.",
            "Enable strict application whitelisting.",
            "Review and clean startup entries.",
            "Consult with security professionals for analysis.",
            "Keep all software up to date.",
            "Perform rootkit detection to uncover hidden threats.",
            "Run file integrity checks to detect altered files.",
            "Consider using virtualization tools for sensitive tasks.",
            "Enable behavioral analysis in security software.",
            "Monitor system performance for unusual spikes."
        ]
    },
    9: {  # Gatak
        "behaviour": [
            "Installs a backdoor for remote access",
            "Steals sensitive data and credentials",
            "Downloads and executes additional malware",
            "Communicates with command and control servers",
            "Attempts to evade detection using stealth techniques",
            "Modifies system files and settings",
            "Persists by creating scheduled tasks",
            "Can spread laterally within networks",
            "Disables certain security features",
            "Deletes logs to hide activity",
            "Uses encryption to obfuscate its communications",
            "Hijacks legitimate system processes to avoid detection",
            "Attempts to disable or tamper with backup systems",
            "May attempt to exfiltrate sensitive data via email",
            "Uses social engineering to compromise additional systems"
        ],
        "recommended_action": [
            "Disconnect the system from the network immediately.",
            "Perform a full system scan with updated antivirus.",
            "Change all passwords after cleaning.",
            "Monitor for unauthorized remote access attempts.",
            "Restore system from a clean backup if possible.",
            "Enable and configure firewalls.",
            "Educate users about spear-phishing threats.",
            "Check for and remove unauthorized scheduled tasks.",
            "Consult with cybersecurity experts for full remediation.",
            "Report the incident to appropriate authorities.",
            "Ensure endpoint security software is up to date.",
            "Use network monitoring tools to detect lateral movement.",
            "Review email filters and block malicious attachments.",
            "Perform regular network vulnerability assessments.",
            "Enable multi-factor authentication for critical services."
        ]
    }
}

MALWARE_CLASSES = {
    1: "Ramnit", 2: "Lollipop", 3: "Kelihos_ver3", 4: "Vundo",
    5: "Simda", 6: "Tracur", 7: "Kelihos_ver1", 8: "Obfuscator.ACY", 9: "Gatak"
}

MALWARE_DESCRIPTIONS = {
    1: "Trojan Downloader", 2: "Adware", 3: "Botnet Malware", 4: "Spyware",
    5: "Worm", 6: "Trojan Dropper", 7: "Botnet Variant", 8: "Obfuscation Tool", 9: "Backdoor Trojan"
}

MALWARE_THREAT_LEVELS = {
    1: "high",         # Ramnit
    2: "intermediate", # Lollipop
    3: "high",         # Kelihos_ver3
    4: "intermediate", # Vundo
    5: "extreme",      # Simda
    6: "intermediate", # Tracur
    7: "high",         # Kelihos_ver1
    8: "low",          # Obfuscator.ACY
    9: "extreme"       # Gatak
}

MALWARE_CONFIDENCE_SCORE = {
    1: 80,  # Ramnit
    2: 80,  # Lollipop
    3: 80,  # Kelihos_ver3
    4: 80,  # Vundo
    5: 80,  # Simda
    6: 80,  # Tracur
    7: 80,  # Kelihos_ver1
    8: 80,  # Obfuscator.ACY
    9: 80   # Gatak
}

APPLICATION_USERS = {
    1: {
        "role": "admin",
        "first_name": "System",
        "last_name": "Admin",
        "email": "admin@defendxpert.com",
        "password_hash": "scrypt:32768:8:1$B6vHNwH5DvyBg3zg$6d1cd169b75d91b9637d384953956a215821b1d57c348aeba03089a6a70261b57842bd979e73214c91d0c8343a720c667a82f121b24da270619507ea3f23a91b"
    },
    2: {
        "role": "user",
        "first_name": "Bina",
        "last_name": "Kandel",
        "email": "bina.kandel@defendxpert.com",
        "password_hash": "scrypt:32768:8:1$sm2z0YuiVYaDPx56$d8e144a130b5402a8f2f48a9137aea46c7f3b7e42762327c916b5e77a918251ed672d8a427339c550f127871f8e4b3e8df9ac4c78bafb5def10ec059994c234c"
    },
    3: {
        "role": "user",
        "first_name": "Sashil",
        "last_name": "Shrestha",
        "email": "sashil.shrestha@defendxpert.com",
        "password_hash": "scrypt:32768:8:1$AJOOmjoCZYEV3y5b$eed8e1bf64cb57bddc44ac9906ecc1338a98d70f5d1e977d9969c1ba87934e7c0e39bf2c302bd55de9741dd4d3278f7b3fe76378d12625ae59b5b8c7a8704dae"
    },
    4: {
        "role": "user",
        "first_name": "Radu",
        "last_name": "Cojocaru",
        "email": "radu.cojocaru@defendxpert.com",
        "password_hash": "scrypt:32768:8:1$A3prgZIWb2gy5XSD$ba64dd3c797840aaf4f8f4c6ca102f3d04e84e697f9b6800e0671452d94541206674662b11b6d71a9972f38aaf27f89ba8cba62c1b097686a2294d7624f7cb19"
    },
    5: {
        "role": "user",
        "first_name": "Owais",
        "last_name": "Saeed",
        "email": "owais.saeed@emailshield.com",
        "password_hash": "scrypt:32768:8:1$Dml81qmJv1sWUoSc$acf87b45aba00bda860c5d857c2b3d75a47b007e91b4d44bf7ad0f7d1b3422e30555464b0adde6460e7d62f41319af3c4680aa87f3a763ce234612b96e87a9d8"
    },
    6: {
        "role": "user",
        "first_name": "Noarin",
        "last_name": "Panjwani",
        "email": "noarin.panjwani@emailshield.com",
        "password_hash": "scrypt:32768:8:1$FUaSLHrQ6M0yCS2r$ba6cc4c2341f155cdbe7a2b569154050bd440f0a6f26c001f71ef55bf9651835812af2b7924aaa2d819cb7dc34ee559cb2166c5fcffa253ac25d2970c0397313"
    }
}

FEEDBACK = {
    1:{
        "user_id":4,
        "malware_id":2,
        "confidence": 90,
        "is_prediction_helpful":True,
        "threshold_at_prediction":80
    },
    2:{
        "user_id":3,
        "malware_id":5,
        "confidence": 95,
        "is_prediction_helpful":True,
        "threshold_at_prediction":80
    },    
    3:{
        "user_id":2,
        "malware_id":1,
        "confidence": 70,
        "is_prediction_helpful":False,
        "threshold_at_prediction":80
    },    
    4:{
        "user_id":5,
        "malware_id":9,
        "confidence": 93,
        "is_prediction_helpful":True,
        "threshold_at_prediction":80
    },
    5:{
        "user_id":6,
        "malware_id":8,
        "confidence": 79,
        "is_prediction_helpful":False,
        "threshold_at_prediction":80
    },
}