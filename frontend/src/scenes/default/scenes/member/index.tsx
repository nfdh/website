import * as React from "react";
import { useNavigate, Routes, Route } from "react-router";

import { VerticalMenu, VerticalMenuGroup, VerticalMenuItem } from "../../../../components/VerticalMenu";

import * as styles from "./index.css";
import { useUserInfo } from "../../../../services/auth";
import { MemberHomeScene } from "./scenes/home";
import { UsersScene } from "./scenes/users";

export function MemberScene() {
    const userInfo = useUserInfo();
    const navigate = useNavigate();

    React.useEffect(function() {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo]);

    if (!userInfo) {
        return <div className={styles.center}>
            Deze pagina is alleen beschikbaar voor leden. U word nu doorgeleid naar de inlogpagina.
        </div>;
    }

    return <div className={styles.center}>
        
        <VerticalMenu className={styles.menu}>
            <VerticalMenuGroup title="Leden">
                <VerticalMenuItem to="">Startpagina</VerticalMenuItem>
            </VerticalMenuGroup>
            {/*
            <VerticalMenuGroup title="Dekverklaring">
                <VerticalMenuItem to="dekverklaring">Dekverklaring</VerticalMenuItem>
                <VerticalMenuItem to="huiskeuring">Inschrijven huiskeuring</VerticalMenuItem>
            </VerticalMenuGroup>
            <VerticalMenuGroup title="Huiskeuring">
                <VerticalMenuItem to="dekverklaring">Dekverklaring</VerticalMenuItem>
                <VerticalMenuItem to="huiskeuring">Inschrijven huiskeuring</VerticalMenuItem>
            </VerticalMenuGroup>*/}
            <VerticalMenuGroup title="Website beheer">
                <VerticalMenuItem to="gebruikers">Gebruikers</VerticalMenuItem>
            </VerticalMenuGroup>
        </VerticalMenu>

        <div className={styles.content}>
            <Routes>
                <Route path="*" element={<MemberHomeScene />} />
                <Route path="gebruikers/*" element={<UsersScene />} />
            </Routes>
        </div>
    </div>
}