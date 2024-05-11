import "./style.css";
import React, {useState} from "react";
import AdministrationNavigationBar from "./components/AdministrationNavigationBar/AdministrationNavigationBar";
import CategoriesView from "./components/CategoriesView/CategoriesView";
import ClientsView from "./components/ClientsView/ClientsView";
import Splitter from "../../components/Splitter/Splitter";

function AdministrationPage() {
    const views = new Map();
    views.set("Категории" , (<CategoriesView/>));
    views.set("Клиенты" , (<ClientsView/>));

    const [activeView, setActiveView] = useState(null);

    return (
        <div>
            <AdministrationNavigationBar views={views} setView={setActiveView} activeView={activeView}/>
            <Splitter/>
            {views.get(activeView)}
        </div>
    );
}

export default AdministrationPage;