export type Preferences =
    | {
        app_name: string;
        logo_img: string
    }
    | {
        app_name: "Broadcast";
        logo_img: "broadcast-logo.svg"
    };

export const setPreferencesInLocalStorage = (preferences: Preferences): void => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
};

export const getPreferencesFromLocalStorage = (): Preferences => {
    const storedPreferences = localStorage.getItem('preferences');
    return storedPreferences ? JSON.parse(storedPreferences) : 
        { app_name: "Broadcast", logo_img: "broadcast-logo.svg" };
};