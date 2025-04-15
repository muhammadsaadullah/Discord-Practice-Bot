# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

## [2.1.1] - 2025-04-15

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
