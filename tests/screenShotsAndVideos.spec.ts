import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Screenshots and videos', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

    const usingTheGrid = page.locator('nb-card', { hasText: 'Using the Grid' })
    const usingTheGridEmail = usingTheGrid.getByRole('textbox', { name: 'Email' }).first()

    await usingTheGridEmail.fill('test@example.com')
    // await usingTheGridEmail.fill('vish@gmail.com')

    const emailFieldValue = await usingTheGridEmail.inputValue()
    expect(emailFieldValue).toBe('test@example.com')
    await expect(usingTheGridEmail).toHaveValue('test@example.com')

    await usingTheGrid.getByRole('radio', { name: 'Option 1' }).check({ force: true })
    await expect(usingTheGrid.getByRole('radio', { name: 'Option 1' })).toBeChecked()

    await usingTheGrid.getByRole('radio', { name: 'Option 2' }).check({ force: true })
    await expect(usingTheGrid.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    await expect(usingTheGrid.getByRole('radio', { name: 'Option 2' })).toBeChecked()

    await page.screenshot({ path: 'screenShots/screenshot.png' })
    const buffer = await page.screenshot()
//    console.log(buffer.toString('base64'))
    const usingTheCard = page.locator('nb-card', { hasText: 'Inline form' })
    const name = usingTheCard.getByPlaceholder('Jane Doe')
    await name.fill('Vishwanath KC')
    const email = usingTheCard.getByPlaceholder('Email')
    await email.fill('testVish@gmail.com')
    await usingTheCard.screenshot({ path: 'screenShots/InlineForm.png' })
})