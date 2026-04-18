import {test, expect} from '@playwright/test';

test.beforeEach(async({page, }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText("Form Layouts").click();
});

test('Basic locators', async({page}) => {

    await page.locator('input').first().fill('test')
    await page.locator('#inputEmail1').click()
    await page.locator('.shape-rectangle')
    await page.locator('[type="email"]')
    await page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
    await page.locator(':text("Using")')
    await page.locator(':Text-is("Using the Grid")')
    await page.locator('//*[@id="inputEmail1"]')
    await page.locator('input[placeholder="Email"][nbinput]')

})

test('User facing locator', async({page}) => {

        await page.getByRole('textbox', {name: 'Email'}).first().fill('test')
        await page.getByRole('button', {name:'Sign in'}).first().click()
        await page.getByPlaceholder('Jane Doe').first().fill('Kogile')
        await page.getByLabel('Email').first().fill('Raja')
        await page.getByText('Basic form').first().click()
        await page.getByTitle('IoT Dashboard').click()

})

test('locating child elements', async({page}) => {
    await page.locator('nb-card').locator('nb-radio').locator(':text("Option 2")').click()
    await page.locator('nb-card nb-radio :text("Option 1")').click()
    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()
})

test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).first().fill('test')
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).first().fill('Movie')
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: 'Email'}).first().fill('Ramayaana')
    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).first().fill('Yogisha')
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).first().fill('Kogile')
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).first().fill('Maha Raja')
    await page.getByTitle('IoT Dashboard').click()
})

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const emailInput = basicForm.getByRole('textbox', {name: 'Email'})
    const passwordInput = basicForm.getByRole('textbox', {name: 'Password'})
    const signInButton = basicForm.getByRole('button', {name: 'Sign in'}).first()
    
    await emailInput.fill('test@test.com')
    await passwordInput.fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await signInButton.click()
    await expect(emailInput).toHaveValue('test@test.com')
})

test('extract values from DOM', async({page}) =>{

    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const submitBtnText = await basicForm.getByRole('button').textContent()
    await expect(submitBtnText).toBe('Submit')

    //all text values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    await expect(allRadioButtonLabels).toContain("Option 1")

    //input value
    const emailInput = basicForm.getByRole('textbox', {name: 'Email'})
    await emailInput.fill('vish@gmail.com')
    const emailInputValue = await emailInput.inputValue()
    await expect(emailInputValue).toBe('vish@gmail.com')

    const placeholderValue = await emailInput.getAttribute('placeholder')
    await expect(placeholderValue).toBe('Email')

})

test.skip('navigate to Date picker', async({page}) => {
    await page.getByText("Datepicker").first().click()
})