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

/**
 * Selenium test class for testing the functionality of CiCdBot
 * 
 * @author srivassumit
 *
 */
public class SeleniumTest {
	private static final String USERNAME = System.getenv("SLACKXUSER");
	private static final String PASSWORD = System.getenv("SLACKXPWD");
	private static WebDriver driver;

	/**
	 * set up
	 * 
	 * @throws Exception
	 */
	@BeforeClass
	public static void setUp() throws Exception {
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		if (USERNAME == null || PASSWORD == null) {
			System.out.println(
					"Set the environment variables SLACKXUSER and SLACKXPWD with the username and password of the slack user to test.");
			throw new Exception("Environment variables not set!");
		} else {
			driver.get("https://se-project2017.slack.com/");

			// Wait until page loads and we can see a sign in button.
			WebDriverWait wait = new WebDriverWait(driver, 30);
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

			// Find email and password fields.
			WebElement email = driver.findElement(By.id("email"));
			WebElement pw = driver.findElement(By.id("password"));

			// Enter our email and password
			email.sendKeys(USERNAME);
			pw.sendKeys(PASSWORD);

			// Click
			WebElement signin = driver.findElement(By.id("signin_btn"));
			signin.click();
		}
	}

	/**
	 * tear down
	 * 
	 * @throws Exception
	 */
	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	/**
	 * Test case to check that the channel is active and receiving messages.
	 */
	@Test
	public void testChannelActive() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("selenium-test"));

		// Type something
		WebElement messageBox = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBox);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBox);
		actions.click();
		actions.sendKeys("hello world, from Selenium");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver
				.findElement(By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
		assertNotNull(msg);
		Thread.sleep(5000);
	}

	/**
	 * test case to test that slackBot is active.
	 * 
	 * throws Exception
	 */
	@Test
	public void testBotActive() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("selenium-test"));

		wait.until(ExpectedConditions
				.visibilityOfElementLocated(By.xpath("//div[@class='p-channel_sidebar__close_container']/a")));
		List<WebElement> spans = driver.findElements(By.xpath("//div[@class='p-channel_sidebar__close_container']/a"));
		assertNotNull(spans);

		for (int i = 0; i < spans.size(); i++) {
			String elementText = spans.get(i).getAttribute("innerText");
			if ("cicdbot".equals(elementText)) {
				String status = spans.get(i).getAttribute("innerHTML");
				// assertTrue(status.contains("presence--away"));
				assertTrue(status.contains("presence--active"));
			}
		}
		Thread.sleep(5000);
	}

	/**
	 * test that slackBot is replying to incoming messages.
	 * 
	 * @throws Exception
	 * 
	 */
	@Test
	public void testBotReplies() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions.titleContains("selenium-test"));

		// Type something
		WebElement messageBox = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBox);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBox);
		actions.click();
		actions.sendKeys("@cicdbot hi");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(60, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		WebElement msg = driver.findElement(By.xpath("//span[@class='message_body' and text() = \"Hello\"]"));
		assertNotNull(msg);
		Thread.sleep(5000);
	}

	/**
	 * test for useCase 1: return PR details of a specific pull request.
	 * 
	 * @throws Exception
	 */
	@Test
	public void testGetPRDetais() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions.titleContains("selenium-test"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("@cicdbot Get pull request 1 for octat for repo Hello-World");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[@class='message_body']")));
		List<WebElement> messages = driver.findElements(By.xpath("//span[@class='message_body']"));
		boolean notFound = true;
		wait.withTimeout(80, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		for (WebElement message : messages) {
			if (message.getText().contains("Id  State      Title            Description")) {
				notFound = false;
				assertTrue(true);
			}
		}
		if (notFound)
			assertTrue(false);
		Thread.sleep(5000);
	}

	/**
	 * test for useCase 2: return a list of open pull requests for a Repo.
	 * 
	 * @throws Exception
	 */
	@Test
	public void testviewPRs() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions.titleContains("selenium-test"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("@cicdbot Get pull requests for octat for repo Hello-World");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[@class='message_body']")));
		List<WebElement> messages = driver.findElements(By.xpath("//span[@class='message_body']"));
		boolean notFound = true;
		wait.withTimeout(80, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		for (WebElement message : messages) {
			if (message.getText().contains("Id  Title")) {
				notFound = false;
				assertTrue(true);
			}
		}
		if (notFound)
			assertTrue(false);
		Thread.sleep(5000);
	}

	/**
	 * test for useCase 3: merging a pull request.
	 * 
	 * @throws Exception
	 */
	@Test
	public void testMergePR() throws Exception {
		driver.get("https://se-project2017.slack.com/messages/selenium-test");
		WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions.titleContains("selenium-test"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("@cicdbot merge #1 pull request for aakarshg/serverprovision");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(60, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = \"Pull Request successfully merged\"]"));
		assertNotNull(msg);
		Thread.sleep(5000);
	}

	// /**
	// * usecase 1 actual test depends on Jenkins interaction
	// */
	// @Test
	// public void Usecase1() {
	// driver.get("https://se-project2017.slack.com/messages/selenium-test");
	// WebDriverWait wait = new WebDriverWait(driver, 30);
	// wait.until(ExpectedConditions.titleContains("selenium-test"));
	//
	// // Type something
	// WebElement messageBot = driver.findElement(By.id("msg_input"));
	// assertNotNull(messageBot);
	//
	// Actions actions = new Actions(driver);
	// actions.moveToElement(messageBot);
	// actions.click();
	// actions.sendKeys("@botCiCd merge #1 pull request for
	// aakarshg/serverprovision"); // pull request syntax
	// actions.sendKeys(Keys.RETURN);
	// actions.build().perform();
	//
	// wait.withTimeout(3,
	// TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
	// WebElement msg = driver.findElement(By.xpath("//span[@class='message_body'
	// and text() = 'Yes, Admin, merged!']")); //initial details like of pull
	// request
	// assertNotNull(msg);
	// }
}
