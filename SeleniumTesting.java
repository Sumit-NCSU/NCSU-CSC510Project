@Test
public void postMessage()
{
	driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");

	// Wait until page loads and we can see a sign in button.
	WebDriverWait wait = new WebDriverWait(driver, 30);
	wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

	// Find email and password fields.
	WebElement email = driver.findElement(By.id("email"));
	WebElement pw = driver.findElement(By.id("password"));

	// Enter our email and password
	// If running this from Eclipse, you should specify these variables in the run configurations.
	email.sendKeys(System.getenv("SLACK_EMAIL"));
	pw.sendKeys(System.getenv("SLACK_PASSWORD"));

	// Click
	WebElement signin = driver.findElement(By.id("signin_btn"));
	signin.click();

	// Wait until we go to general channel.
	wait.until(ExpectedConditions.titleContains("general"));

	// Switch to #selenium-bot channel and wait for it to load.
	driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/selenium-bot");
	wait.until(ExpectedConditions.titleContains("selenium-bot"));

	// Type something
	WebElement messageBot = driver.findElement(By.id("msg_input"));
	assertNotNull(messageBot);
		
	Actions actions = new Actions(driver);
	actions.moveToElement(messageBot);
	actions.click();
	actions.sendKeys("hello world, from Selenium");
	actions.sendKeys(Keys.RETURN);
	actions.build().perform();

	wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

	WebElement msg = driver.findElement(
			By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
	assertNotNull(msg);
}