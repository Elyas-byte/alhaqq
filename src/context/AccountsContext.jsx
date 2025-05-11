import React, { createContext, useState } from 'react';

// Create the context
export const AccountsContext = createContext();

// Create the provider
const AccountsProvider = ({ children }) => {
    const [isAccountsVisible, setIsAccountsVisible] = useState(false);

    const unVisible = () => {
        setIsAccountsVisible(false)
    }

    const toggleAccountsVisibility = () => {
        setIsAccountsVisible((prev) => !prev);
    };

    return (
        <AccountsContext.Provider value={{ isAccountsVisible, toggleAccountsVisibility, unVisible }}>
            {children}
        </AccountsContext.Provider>
    );
};

export default AccountsProvider;
