package com.tekvizion.iosTests;

import com.tekvizion.pageObjects.ios.Dashboard;
import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.testUtils.IOSBaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Set;

public class LoginTest extends IOSBaseTest {
    HomePage homePage;
    @Test
    public void successfullyLogin(){
        homePage = new HomePage(driver);
        Login login = homePage.goToLoginForm();
        Dashboard dashboard = login.signIn();
//        String title = dashboard.getTitle();
//        Assert.assertEquals(title, "Spotlight");
    }

    @Test
    public void addNote(){
        Dashboard dashboard = new Dashboard(driver);
        Notes notes = dashboard.goToNotes();
        String expectedNote = notes.addNote("note");
        String actualNote =notes.verifyNote();
        Assert.assertEquals(expectedNote, actualNote);
    }

    @Test
    public void closeNote(){
        Notes notes = new Notes(driver);
        String expectedMessage = "Note closed successfully!";
        String actualMessage = notes.closeNote("note");
        Assert.assertEquals(expectedMessage, actualMessage);
    }

}
