//Testing the JS script
const puppeteer = require('puppeteer');
const assert = require('assert');

describe('Session page', function() {
    let browser;
    let page;

    before(async function() {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:3000/session.html');
    });

    after(async function() {
        await browser.close();
    });

    it('should display the correct number of questions', async function() {
        const numOfQuestions = await page.$eval('#numOfQuestions', el => el.textContent.trim());
        assert.strictEqual(numOfQuestions, 'Number of Questions: 10');
    });

    it('should display a question when the page is loaded', async function() {
        const question = await page.$eval('#question', el => el.textContent.trim());
        assert.notStrictEqual(question, '');
    });

    it('should display the correct score when a question is answered correctly', async function() {
        await page.click('.boolAns[value="true"]');
        const score = await page.$eval('#score', el => el.textContent.trim());
        assert.strictEqual(score, '1');
    });

    it('should display the correct message when a question is answered incorrectly', async function() {
        await page.click('.abcdAns[value="C"]');
        const message = await page.$eval('#message', el => el.textContent.trim());
        assert.strictEqual(message, 'Incorrect. The correct answer is D.');
    });

    it('should skip a question when the skip button is clicked', async function() {
        await page.click('#skipButton');
        const completedQuestions = await page.$eval('#completedQuestions', el => el.textContent.trim());
        assert.strictEqual(completedQuestions, '1');
    });
});