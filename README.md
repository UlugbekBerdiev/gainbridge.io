# Shopping Cart UI Automation Tests

Automated UI tests for a shopping cart website using Playwright with TypeScript. The tests are implemented using the Page Object Model (POM) pattern.

## Features

- Automated UI testing using Playwright
- Page Object Model implementation
- Cross-browser testing (Chromium)
- Responsive design testing
- Test coverage for navigation, cart operations, product details, and checkout process

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browser:
```bash
npx playwright install chromium
```

## Project Structure

```
├── pages/                  # Page Object Models
│   ├── BasePage.ts        # Base page with common functionality
│   └── ShoppingCartPage.ts # Shopping cart page implementation
├── tests/                  # Test files
│   └── shopping-cart.spec.ts # Shopping cart test suite
├── playwright.config.ts    # Playwright configuration
├── package.json           # Project dependencies and scripts
└── README.md             # Project documentation
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

Run specific test file:
```bash
npx playwright test shopping-cart.spec.ts
```

View test report:
```bash
npx playwright show-report
```

## Configuration

The project uses Playwright's configuration file (`playwright.config.ts`) with the following settings:

- Base URL: https://gb-saa-test.vercel.app
- Browser: Chromium
- Screenshots: On test failure
- Video: On test failure
- Trace: On first retry
- Parallel execution: Enabled
- Retries: 2 on CI, 0 locally

## Page Object Model

The project follows the Page Object Model pattern:

- `BasePage`: Common functionality and methods
- `ShoppingCartPage`: Shopping cart specific functionality

## Test Coverage

1. Navigation
   - Link visibility and enabled state
   - Page navigation

2. Cart Operations
   - Item count verification
   - Product details validation
   - Price calculations
   - Quantity management
   - Out-of-stock handling

3. Checkout Process
   - Button visibility
   - Disabled state handling
   - Error messages

4. Responsive Design
   - Mobile (375x667)
   - Tablet (768x1024)
   - Desktop (1920x1080)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
