// Different Pages in the App
export const Pages = {
    Home: "Home",
    TrendsOverTime: "TrendsOverTime",
    Overview: "Overview",
    About: "About",
    Contact: "Contact"
}

export const DefaultPage = Pages.TrendsOverTime;

export const PageSrc = {};
PageSrc[Pages.TrendsOverTime] = "./static/trendsOverTime/trendsOverTime.html"
PageSrc[Pages.Overview] = "./static/overview/overview.html"
PageSrc[Pages.About] = "./static/about/about.html"
PageSrc[Pages.Contact] = "./static/contact/contact.html"


// Available Languages
export const Languages = {
    English: "en",
    French: "fr"
}

export const DefaultLanguage = Languages.English;