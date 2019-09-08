import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Slider from 'react-slick';

import Header from "./components/Header";
import Quote from "./components/Quote";
import Footer from "./components/Footer";

import Index from "./pages/Index";
import Reg from "./pages/Reg";
import Login from "./pages/Login";
import NewsAdd from "./pages/News/Add";
import NewsIndex from "./pages/News/Index";
import ProjectList from "./pages/Projects/List";
import ProjectAdd from "./pages/Projects/Add";
import ProjectGet from "./pages/Projects/Index";
import ProjectEdit from "./pages/Projects/Edit";
import CasesList from "./pages/Cart/List";
import Activate from "./pages/Activate";
import About from "./pages/About";
import UserProjectList from "./pages/User/List";
import Contacts from "./pages/Contacts";

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
				<Quote
					text="Все дороги к успеху проходят через боль. Поверь, как бы ты не выкручивался, обходных путей нет. Будь это легко, все бы это делали. Боль должна пройти сквозь твое тело, без этого никак. А когда она это сделает, знаешь что займет ее место? Правильно, успех!"/>
				<Quote
					text="Часто приходится слышать: 'Он ещё не нашел себя'. Но найти себя невозможно - себя можно только создать."
					author="Томас Сас"/>
				<Quote
					text="Хочешь достичь УСПЕХА? Избегая ПЯТИ пороков: сонливости, лени, страха, гнева, нерешительности"/>
				<Quote
					text="Воля - это то, что заставляет тебя побеждать, когда твой рассудок говорит тебе, что ты повержен"
					author="Карлос Кастанада"/>
				<Quote text="Одержав победу не заносись. Потерпеа поражение, не сгибайся!"/>
				<Quote text="Всё будет не так, как мы решим. Всё будет тогда, когда мы решимся."
				       author="Николас Кейдж"/>
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
				<Route path="/projects/edit/:id" component={ProjectEdit}/>
				<Route path="/cases" component={CasesList}/>
				<Route path="/activate/:id" component={Activate}/>
				<Route path="/about" component={About}/>
				<Route path="/contacts" component={Contacts}/>
				<Route path="/user/cabinet" component={UserProjectList}/>
			</div>
			<Footer/>
		</BrowserRouter>
	</div>
};

export default App;
