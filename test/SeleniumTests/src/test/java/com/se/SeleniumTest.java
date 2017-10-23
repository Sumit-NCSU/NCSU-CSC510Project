package com.se;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class SeleniumTest {
	private static WebDriver driver;

	@BeforeClass
	public static void setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}

	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	@Test
	public void postMessage() {
		driver.get("https://se-project2017.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run
		// configurations.
		email.sendKeys();
		pw.sendKeys();

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-project2017.slack.com/messages/selenium-bot");
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

		WebElement msg = driver
				.findElement(By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
		assertNotNull(msg);

		// WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions
				.visibilityOfElementLocated(By.xpath("//div[@class='p-channel_sidebar__close_container']/a")));
		List<WebElement> spans = driver.findElements(By.xpath("//div[@class='p-channel_sidebar__close_container']/a"));
		assertNotNull(spans);
		// String elementText = spans.get(5).getAttribute("innerText");

		for (int i = 0; i < spans.size(); i++) {
			String elementText = spans.get(i).getAttribute("innerText");
			if ("bleh".equals(elementText)) {
				System.out.println(elementText);
				String status = spans.get(i).getAttribute("innerHTML");
				System.out.println(status);

				assertTrue(status.contains("presence--away"));

			}

		}

	}
}
