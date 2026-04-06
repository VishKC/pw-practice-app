import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Using the Grid', () => {
  
    test.beforeEach('Form Layouts page', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async({page}) => {
        const usingTheGrid = page.locator('nb-card', {hasText: 'Using the Grid'})
        const usingTheGridEmail = usingTheGrid.getByRole('textbox', {name: 'Email'}).first()

        await usingTheGridEmail.fill('test@example.com')
        await usingTheGridEmail.fill('vish@gmail.com')

        const emailFieldValue = await usingTheGridEmail.inputValue()
        expect(emailFieldValue).toBe('vish@gmail.com')
        await expect(usingTheGridEmail).toHaveValue('vish@gmail.com')
    })
    
    test('Radio buttons', async({page}) => {
        const usingTheGrid = page.locator('nb-card', {hasText: 'Using the Grid'})

        await usingTheGrid.getByRole('radio', {name: 'Option 1'}).check({force: true})
        await expect(usingTheGrid.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGrid.getByRole('radio', {name: 'Option 2'}).check({force: true})
        await expect(usingTheGrid.getByRole('radio', {name: 'Option 1'})).not.toBeChecked()
        await expect(usingTheGrid.getByRole('radio', {name: 'Option 2'})).toBeChecked()

    })

})

test('Checkboxes', async({page}) => {

    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allCheckBoxes = page.getByRole('checkbox')
    for(const box of await allCheckBoxes.all()){
        box.check({force: true})
        await expect(box.isChecked()).toBeTruthy()
    }

/*    const usingTheGrid = page.locator('nb-card-body')

    const textField = await usingTheGrid.getByPlaceholder('.form-group')
    await textField.clear()
    await textField.fill('Vishnu')
    await expect(textField).toContainText('Vishnu')
*/
    const cardFooter = page.locator('nb-card-footer')
    const button = await cardFooter.getByRole('button', {name: 'Show toast'})
    await button.click()
})