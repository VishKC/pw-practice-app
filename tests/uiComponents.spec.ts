import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe.only('Using the Grid', () => {
    //test.describe.configure({retries: 2})
  
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

test('Dropdowns', async({page}) => {

    const dropdown = page.locator('ngx-header nb-select')
    await dropdown.click()

    //page.getByRole('List')
    //page.getByRole('listitem')

    const optionList = page.locator('nb-option-list nb-option')
    expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)")

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    
    await dropdown.click()

    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color !== "Corporate")
            await dropdown.click()
    }
    
})

test('toolTips', async({page}) => {

    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    const topToolTip = toolTipCard.getByRole('button', {name: 'Top'})
    await topToolTip.hover()

    //page.getByRole('tooltip') works only for the first tooltip, so we need to use the locator to get the tooltip text
    
    // const toolTipText = page.locator('nb-tooltip')
    // await expect(toolTipText).toHaveText('This is a tooltip')

    const toolTip = page.locator('nb-tooltip').textContent()
    expect(toolTip).toEqual('This is a tooltip')

})

test('Dialog boxes', async({page}) => {

    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    
    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept() 
    })

    await page.getByRole('table').locator('tr', {hasText:"mdo@gmail.com"}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Modify by row data', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const targetRow = page.getByRole('row', {name: 'barbara@yandex.ru'})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('20')
    await page.locator('.nb-checkmark').click()

//    await expect(targetRow).toHaveText('20')


})

test('Modify by column data', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    await page.locator('ng2-smart-table-pager').getByText('2').click()

    const targetRowById = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText('11')})
      
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('vishkc@example.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('vishkc@example.com')
})

test('Search and verify results', async({page}) => {

    const ageList = ["20", "30", "40", "200"]

    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    for(const age of ageList){
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500) // wait for the table to update with the filtered results
    const ageRows = page.locator('tbody tr')

    for(const row of await ageRows.all()){
        const cellValue = await row.locator('td').last().textContent()
        if(age == "200"){
            expect(await page.locator('table tbody').textContent()).toEqual(" No data found ")
        }
        else{
            expect(cellValue).toEqual(age)
        }
        
    }

    }

})

test('Learn Date picker', async({page}) => {

    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
    
    const calenderInputField = page.getByPlaceholder('Form Picker')
    await calenderInputField.click()
    
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('2', {exact: true}).click()
    await expect(calenderInputField).toHaveValue('Apr 2, 2026')

})

test('Date picker using JS', async({page}) => {

    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
    
    const calenderInputField = page.getByPlaceholder('Form Picker')
    await calenderInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 5)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' })
    const expectedMonthlong = date.toLocaleString('default', { month: 'long' })
    const expectedYear = date.getFullYear().toString()

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    let expectedMonthAndYear = `${expectedMonthlong} ${expectedYear}`
    while(!calendarMonthAndYear?.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    const expectedDateInInput = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    await expect(calenderInputField).toHaveValue(expectedDateInInput)

})


test('automate Sliders', async ({page}) => {

    //update attribute cx & cy
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '264.180')
        node.setAttribute('cy', '180.481')

    })
    await tempGauge.click()

    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    if(box){
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    //console.log("X: "+x+" Y: "+y)
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

    }
})