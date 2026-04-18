import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) => {

    page.goto('https://www.globalsqa.com/demo-site/draganddrop/')
    const header = await page.locator('h1').textContent()
    expect(header).toEqual('Drag And Drop')
})

test('Drag and Drop', async({page}) => {

    //drag and drop using direct function
    const frame = await page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    //drag and drop more of mouse actions
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})