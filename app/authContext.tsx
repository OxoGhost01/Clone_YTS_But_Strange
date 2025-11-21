import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
connected: false,
setConnected: (v: boolean) => {},
});

export function AuthProvider({ children }: any) {
const [connected, setConnected] = useState(false);

return (
    <AuthContext.Provider value={{ connected, setConnected }}>
    {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}
