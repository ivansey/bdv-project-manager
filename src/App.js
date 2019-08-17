import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Slider from 'react-slick';

import Header from "./components/Header";
import Quote from "./components/Quote";

import Index from "./pages/Index";
import Reg from "./pages/Reg";
import Login from "./pages/Login";
import NewsAdd from "./pages/News/Add";
import NewsIndex from "./pages/News/Index";
import ProjectList from "./pages/Projects/List";
import ProjectAdd from "./pages/Projects/Add";
import ProjectGet from "./pages/Projects/Index";

import Activate from "./pages/Activate";

import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

let App = () => {
    let settings = {
        dots: true,
        infinite: false,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        autoplay: true,
        arrows: false
    };

    return <div id="app">
        <BrowserRouter>
            <Header/>
            <Slider {...settings}>
                <Quote text="Если не сейчас, то когда?"/>
                <Quote text="Всё, что ни происходит, всегда так, как нужно, и только к лучшему."/>
                <Quote text="Всё, что ни происходит, всегда так, как нужно, и только к лучшему."/>
            </Slider>
            <div className="content">
                <Route path="/" exact component={Index}/>
                <Route path="/reg" component={Reg}/>
                <Route path="/login" component={Login}/>
                <Route path="/news/add" exact component={NewsAdd}/>
                <Route path="/news/:id" component={NewsIndex}/>
                <Route path="/projects" exact component={ProjectList}/>
                <Route path="/projects/add" exact component={ProjectAdd}/>
                <Route path="/projects/get/:id" component={ProjectGet}/>
                <Route path="/activate/:id" component={Activate}/>
            </div>
        </BrowserRouter>
    </div>
};

export default App;
