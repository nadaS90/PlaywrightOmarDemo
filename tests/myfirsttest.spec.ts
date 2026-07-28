import {test, expect} from '@playwright/test';
test('My first test', async ({page})=>{

    await page.goto("https://google.com/");
    console.log(page.title);
})