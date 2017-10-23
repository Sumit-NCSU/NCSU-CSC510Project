package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class WebTest
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	
/*	@Test
	public void googleExists() throws Exception
	{
		driver.get("http://www.google.com");
        assertEquals("Google", driver.getTitle());		
	}
	

	@Test
	public void FrustrationCount() throws Exception
	{
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='span8']/h3/span[.='Frustration of Software Developers']/../../../div[@class='span4']/p/span[.='55']")));
		List<WebElement> spans = driver.findElements(By.xpath("//div[@class='span8']/h3/span[.='Frustration of Software Developers']/../../../div[@class='span4']/p/span[.='55']"));
		assertNotNull(spans);
		assertEquals(1, spans.size());
		
		}
	
	@Test
	public void ClosedCount() throws Exception
	{
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));
		List<WebElement> spans1 = driver.findElements(By.xpath("//a[@class='status']/span[.='CLOSED']"));
		assertNotNull(spans1);
		assertEquals(5, spans1.size());
		
	}
	@Test
	public void StatusButtonClick() throws Exception
	{
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='OPEN']/../../div/button[.='Participate']")));
		List<WebElement> spans = driver.findElements(By.xpath("//a[@class='status']/span[.='OPEN']/../../div/button[.='Participate']"));
		assertNotNull(spans);
		int countTrue =0;
		for (int i=0;i<spans.size();i++) {
			assertEquals(spans.get(i).isEnabled(),true); 
			
			if (spans.get(i).isEnabled()) {
				 countTrue ++;
				 //spans.get(i).click();		// Uncomment this statement to click on the participate button
			 }
			 
			}
		assertEquals(spans.size(),countTrue); 		// This ensures that all the buttons are enabled and you can click on them
		}
	
		
	@Test
	public void AmazonImage() throws Exception
	{
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 60);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='span8']/h3/span[.='Software Changes Survey']/../../div[@class='award']/div/span/img")));
		List<WebElement> spans = driver.findElements(By.xpath("//div[@class='span8']/h3/span[.='Software Changes Survey']/../../div[@class='award']/div/span/img"));
		assertNotNull(spans);
		String elementText = spans.get(0).getAttribute("src");
		System.out.println(elementText);
		assertEquals("http://www.checkbox.io/media/amazongc-micro.jpg",spans.get(0).getAttribute("src"));
	}
*/	
	@Test
	public void postMessage()
	{
		driver.get("https://se-project2017.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys("WRITE YOUR EMAIL ID");
		pw.sendKeys("PASSWORD");

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

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
		assertNotNull(msg);
	}
}	

