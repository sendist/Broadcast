import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Preferences, setPreferencesInLocalStorage, getPreferencesFromLocalStorage } from "@/lib/preferences";

export default function Rebrand() {
    const [preferences, setPreferences] = useState<Preferences>(() => {
        // Try to get preferences from localStorage
        return getPreferencesFromLocalStorage();
    });

    const originalImg = JSON.parse(localStorage.getItem('preferences') ?? '{}').logo_img;

    const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
    const [displayText, setDisplayText] = useState(preferences.app_name);
    const [isEditing, setIsEditing] = useState(false);
    const [isImageChanged, setIsImageChanged] = useState(false);

    const isTextChanged = preferences.app_name !== displayText;

    const commitPreferences = (newDisplayText:string, newImageFile:string) => {
        // Update the preferences with the new display text
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            app_name: newDisplayText,
            logo_img: newImageFile,
        }));
    
        // Save the updated preferences in localStorage
        setPreferencesInLocalStorage({
            ...preferences,
            app_name: newDisplayText,
            logo_img: newImageFile,
        });

        // Refresh the page
        window.location.reload();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);

            setPreferences((prevPreferences) => ({
                ...prevPreferences,
                logo_img: URL.createObjectURL(file),
            }));
        }
    };

    const handleSaveAvatar = () => {
        if (logoFile) {
            commitPreferences(preferences.app_name, logoFile.name);

            setIsImageChanged(false);
        }
    };

    const handleSaveDisplayName = () => {
        setDisplayText(displayText);
        commitPreferences(displayText, preferences.logo_img);

        setIsEditing(false);
    };

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4  items-start gap-4 sm:gap-0">
                    <div>
                        <h1 className="inline-block text-xl font-semibold">Rebrand</h1>
                        <p className="text-sm text-muted-foreground">Atur Logo dan Nama Baru</p>
                    </div>
                    <div className="space-x-4 space-y-2 -mt-2">

                    </div>
                </div>
                <div className='w-full md:w-3/4 lg:w-3/4 flex flex-col sm:flex-row gap-4'>
                    <Card className='flex-1'>
                        <CardHeader>
                            <div>
                                <CardTitle>Avatar</CardTitle>
                            </div>
                        </CardHeader>
                        <hr/>
                        <CardContent className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:items-center items-start gap-4 sm:gap-0">
                                <div className='flex flex-col'>
                                    {!isImageChanged ? (
                                        <>
                                            <img 
                                                src={originalImg}
                                                alt="Current Avatar"
                                                className="w-48 h-48 mb-4"
                                            />
                                            <Button 
                                                variant="outline"
                                                // className='flex-1'
                                                onClick={() => {setIsImageChanged(true)}}
                                            >
                                                Change My Avatar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <img 
                                                src={preferences.logo_img}
                                                alt="Current Avatar"
                                                className="w-48 h-48 mb-4"
                                            />
                                            <div className='flex flex-col gap-4'>
                                                <Input 
                                                    type="file"
                                                    accept='.svg, .jpeg, .jpg, .png'
                                                    // style={{ width: '316px' }}
                                                    onChange={handleFileChange}
                                                />
                                                
                                                <div className='flex flex-col gap-2 2xl:flex-row sm:gap-3'>
                                                    <Button
                                                        variant="default"
                                                        className='mt-1 flex-1'
                                                        disabled={(!preferences.logo_img.startsWith('blob')) ? true : false}
                                                        onClick={handleSaveAvatar}
                                                    >
                                                        Save Avatar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className='mt-1 flex-1'
                                                        onClick={() => {
                                                            setIsImageChanged(false);
                                                            setPreferences((prevPreferences) => ({
                                                                ...prevPreferences,
                                                                logo_img: originalImg,
                                                            }));
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>                            
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className='flex-1'>
                        <CardHeader>
                            <div>
                                <CardTitle>Display Name</CardTitle>
                            </div>
                        </CardHeader>
                        <hr />
                        <CardContent className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:items-center items-start gap-4 sm:gap-0">
                                <div className='flex flex-col'>
                                    <div className='flex flex-row justify-center items-center mb-4 sm:mb-3'>
                                        
                                        <span className='w-32 sm:w-25 textbold'>App Name:</span>
                                        
                                        <div>
                                            <Input
                                                type="text"
                                                className='inline-block sm:ml-2'
                                                value={displayText}
                                                placeholder="Enter new display text"
                                                onChange={(e) => {
                                                    setDisplayText(e.target.value);
                                                }}
                                                disabled={!isEditing}
                                                onClick={() => {
                                                    setIsEditing(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {isEditing ? (
                                        <>
                                            <div className='flex flex-col gap-2 2xl:flex-row sm:gap-3'>
                                                <Button
                                                    variant="default"
                                                    className='mt-1 flex-1'
                                                    disabled={isTextChanged ? false : true}
                                                    onClick={handleSaveDisplayName}
                                                >
                                                    Save Display Name
                                                </Button>
                                                < Button
                                                    variant="destructive"
                                                    className='mt-1 flex-1'
                                                    onClick={() => {
                                                        setDisplayText(preferences.app_name);
                                                        setIsEditing(false);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <Button 
                                            variant="outline"
                                            className='mt-1'
                                            onClick={() => {
                                                setIsEditing(true)
                                            }}
                                        >
                                            Change Display Name
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
