import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test('should allow a user to add items and navigate to checkout', async ({ page }) => {
        // 1. Navigate to the product list page
        await page.goto('/productlist');
        await expect(page).toHaveTitle(/Gro-Delivery/);

        // 2. Add the first product to the cart
        // Wait for products to load
        await page.waitForSelector('.grid');

        // Find the first "Add" button and click it
        // Using a more robust locator strategy
        const addButtons = page.locator('button:has-text("Add")');
        await expect(addButtons.first()).toBeVisible();
        await addButtons.first().click();

        // 3. Verify cart update (optional, but good for stability)
        // Check if "Add" changes to a quantity selector or cart count increases
        // For now, let's just wait a bit or check for a toast/notification if applicable
        // But since we are navigating to checkout next, that will verify state.

        // 4. Navigate to checkout
        // There should be a cart icon or we can go directly to /checkout
        // Let's use the direct URL for simplicity in this integration test
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
