import {useState} from 'react';
import { Route } from "react-router-dom";
import ActivitiesBrowser from "./components/ActivitiesBrowser";
import MainPage from "./components/MainPage";
import ShowActivity from "./components/ShowActivity";
import ActivitiesEditor from './components/ActivitiesEditor';
import RegionEditor from './components/RegionEditor';
import CityEditor from "./components/CityEditor";
import DurationEditor from "./components/DurationEditor";
import CategoryEditor from "./components/CategoryEditor";
import SubCategotyEditor from "./components/SubCategotyEditor";

import {CssBaseline} from '@material-ui/core';
import useStyles from "./styles";
import NavbarComp from "./components/NavbarComp";
import ListBrowser from "./components/ListBrowser";

import {LoginProvider} from './components/LoginContext'
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const value = { isLoggedIn, setIsLoggedIn };

  const classes = useStyles();

  return (<><LoginProvider value={value}>
  <CssBaseline/>
    <NavbarComp />
  <main>
    <div className={classes.container}>
        <Route exact path="/cities" component={ListBrowser}/>
        <Route exact path="/durations" component={ListBrowser}/>
        <Route exact path="/categories" component={ListBrowser}/>
        <Route exact path="/subcategories" component={ListBrowser}/>
        <Route exact path="/regions" component={ListBrowser}/>

        <Route exact path="/" component={MainPage}/>

        <Route exact path="/search/:searchQuery" component={ActivitiesBrowser}/>

        <Route exact path="/newactivity" component={ActivitiesEditor}/>
        <Route exact path="/editactivity/:editId" component={ActivitiesEditor}/>

        <Route exact path="/newregion" component={RegionEditor}/>
        <Route exact path="/editregion/:regionId" component={RegionEditor}/>

        <Route exact path="/newduration" component={DurationEditor}/>
        <Route exact path="/editduration/:durationId" component={DurationEditor}/>

        <Route exact path="/newcategory" component={CategoryEditor}/>
        <Route exact path="/editcategory/:categoryId" component={CategoryEditor}/>

        <Route exact path="/newsubcategory" component={SubCategotyEditor}/>
        <Route exact path="/editsubcategory/:subCategoryId" component={SubCategotyEditor}/>

        <Route exact path="/newcity" component={CityEditor}/>
        <Route exact path="/editcity/:cityId" component={CityEditor}/>
        
        <Route exact path="/activities" component={ActivitiesBrowser}/>
        <Route exact path="/activities/:activityId" component={ShowActivity}/>

        <Route exact path="/activities/cities/:cityId" component={ActivitiesBrowser}/>
        <Route exact path="/activities/regions/:regionId" component={ActivitiesBrowser}/>
        <Route exact path="/activities/subcategories/:subCatId" component={ActivitiesBrowser}/>
        <Route exact path="/activities/categories/:catId" component={ActivitiesBrowser}/>
        <Route exact path="/activities/durations/:durationId" component={ActivitiesBrowser}/>

    </div>
  </main>
  </LoginProvider>
    </>
  );
}

export default App;