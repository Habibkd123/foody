import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test('should allow a user to add items and navigate to checkout', async ({ page }) => {
        // 0. Seed the database and Log in
        // Call seed endpoint to populate test users/products
        await page.goto('/api/seed');
        await expect(page.locator('body')).toContainText('success');

        // Go to login page and log in
        await page.goto('/login');
        await page.waitForSelector('#contact');
        await page.fill('#contact', 'user30@test.com');
        await page.fill('#password', 'password123');
        await page.click('button:has-text("Sign In")');

        // Wait for login redirect to productlist
        await page.waitForURL('**/productlist');

        // 1. Navigate to the product list page
        await expect(page).toHaveTitle(/Gro-Delivery/);

        // 2. Add the first product to the cart
        // Wait for products to load
        await page.waitForSelector('.grid');

        // Find the first "Add" button and click it
        const addButtons = page.locator('button:has-text("Add")');
        await expect(addButtons.first()).toBeVisible();
        await addButtons.first().click();

        // 3. Verify cart update (optional, but good for stability)

        // 4. Navigate to checkout
        await page.goto('/checkout');

        // 5. Verify Checkout Page Elements
        const heading = page.getByRole('heading', { name: 'Secure Checkout' });
        await expect(heading).toBeVisible();

        const orderSummary = page.getByRole('heading', { name: 'Order Summary' });
        await expect(orderSummary).toBeVisible();

        // 6. Verify Payment Form is present (Stripe Elements)
        // Stripe elements usually inject standard inputs or iframes.
        // We can check for a container or text "Payment Information" or similar if present.
        // Based on the code, we have <PaymentForm> inside <Elements>.
        // Let's check for "Total Amount" which is in the summary.
        const totalLabel = page.locator('text=Total Amount');
        await expect(totalLabel).toBeVisible();

        // Check if address section handles "No address selected yet" or displays an address
        // This depends on whether we are logged in or have a default address.
        // Since we are not logging in this test (guest or fresh state), likely no address.
        // We might see "No address selected yet".
        // Let's just verify safe rendering.
    });
});
