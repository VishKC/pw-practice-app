import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('automate Sliders', async ({page}) => {

    //update attribute cx & cy
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '264.180')
    //     node.setAttribute('cy', '180.481')

    // })
    // await tempGauge.click()

    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')

        await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    if (box) {
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()
    }
    await expect(tempBox).toContainText('30')

})