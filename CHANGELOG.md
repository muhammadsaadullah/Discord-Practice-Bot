# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

# Changelog
## [2.3.0] - 2024-04-16
- updates will be added tommorow

## [2.2.0] - 2025-04-16

### ✨ Added
- Daily streak manager for `/daily`
- International number formatter for wallet balances
- Fun meme-based replies and MeowMurrr humor system
- `/wallet` command to check own and others’ balance
- `/help` command to show command usage

### 🛠️ Changed
- Improved internal command logic and code structure
- Moved registration from slash command `/start` to prefix `!wallet`
- Moved `/start` functionality to `!wallet` (prefix command); slash version deprecated

### 🐞 Fixed
- Minor bugs in command handling
- Wallet lookup errors

### ⚠️ Deprecated
- `/start` command temporarily removed (to be revived later)

---


## [2.1.1] - 2024-04-16

### Just a Small Patch
- Renamed bot from *Practice Bot* to **Meowmurrr** and refreshed branding
- Made behavior adjustments to better align with Top.gg community standards
- Improved internal logic, fixed bugs, and optimized performance
- Added auto-delete for log messages to keep channels clean

## [2.1.0] - 2025-04-15

### Added
- Introduced `/daily` command:
  - Starts a daily streak.
  - Rewards daily profits.
  - Increases user net worth.
  - Encourages consistent engagement.

### Changed
- Updated wallet command logic and UI for better readability and performance.
- Integrated a global ranking system in `/wallet`:
  - Rankings are based on the newly added **Total Net Worth** metric.

### Fixed
- Resolved minor bugs.
- General feature enhancements and stability improvements.


## [2.0.1] - 2025-04-14

### Changed
- Migrated wallet command from guild-specific registration to global scope.
- Ensures wallet command are accessible across all connected servers.


## [2.0.0] – 2025-04-14

### Added
- Introduced a modular command structure to simplify future command extensions.
- Implemented a `wallet` command and basic virtual currency system.
- Added MongoDB connection logic with automatic retry and reconnection.
- Integrated error logging to a file with timestamped entries.
- Human-readable error and recovery console messages for debugging and monitoring.

### Changed
- Restructured project to decouple database logic and command handling.
- Improved validation for environment variables, halting the application if critical fields are missing.

---

## [1.x.x] – *Previous versions*
_(Pending details)_
