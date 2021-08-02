import { useEffect, useState } from "react";
import ActListItem from "./ActListItem";
import { getDataFromServer } from "./DataSender";
import {Typography, Grid,Container} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import useStyles from "../styles";


const ActivitiesBrowser = ({match}) => {
/*     const [loggedIn,setLoggedIn]=useState(false); */
    const classes = useStyles();
    console.log(match);
    const perPage=6;
    const [page,setPage]=useState(0);

    const [activities,setActivities]=useState();
    const [loading,setLoading]=useState(true);

    const changePage = (e,newPage) => {
        console.log('page',page,'newPage',newPage);
        setPage(newPage-1)
    };

    useEffect(()=>{
        let urlAndBodyParams={route:'activities',limit:perPage,skip:perPage*page};
        if (match.path==='/activities/cities/:cityId' && match.params.cityId){
            urlAndBodyParams={route:'activities',query:`?city=${match.params.cityId}`,limit:perPage,skip:perPage*page};
        }else if(match.path==='/activities/regions/:regionId' && match.params.regionId){
            urlAndBodyParams={route:'activities',query:`?region=${match.params.regionId}`,limit:perPage,skip:perPage*page};
        }else if(match.path==='/activities/subcategories/:subCatId' && match.params.subCatId){
            urlAndBodyParams={route:'activities',query:`?subcategory=${match.params.subCatId}`,limit:perPage,skip:perPage*page};
        }else if(match.path==='/activities/categories/:catId' && match.params.catId){
            urlAndBodyParams={route:'activities',query:`?category=${match.params.catId}`,limit:perPage,skip:perPage*page};
        }else if(match.path==='/activities/durations/:durationId' && match.params.durationId){
            urlAndBodyParams={route:'activities',query:`?duration=${match.params.durationId}`,limit:perPage,skip:perPage*page};
        }else if (match.path.startsWith('/search')){
            urlAndBodyParams={route:'search',query:`?q=${match.params.searchQuery}`,limit:perPage,skip:perPage*page};
        }
        console.log(urlAndBodyParams);
        const getData = async () => {
            setLoading(true);
            const resAct = await getDataFromServer(urlAndBodyParams);
            console.log(resAct);
            setActivities(resAct);
            setLoading(false);
        }
        getData();
    },[match,page])

    if (loading)return <p>Loading...</p>

    return (<>
        <Container maxWidth='md'>
          <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
              Browse activities
          </Typography>
        </Container>
        <Container maxWidth='md' className={classes.cardGrid} >
            <Grid container spacing={4}>

        
        {activities.items.map((item,idx)=> <ActListItem key={`lstKey${idx}`} 
                                    id={item.id}
                                    activityName={item.activityName}
                                    description={item.description}
                                    address={item.address}
                                    coords={item.coords}
                                    picture={item.picture[0] || 'images/noimg.jpg'}
                                    time={item.time}
                                    age={item.age}
                                    subCategoryId={item.subCategoryId}
                                    subCategory={item.subCategory}
                                    categoryId={item.categoryId}
                                    category={item.category}
                                    cityId={item.cityId}
                                    cityName={item.cityName}
                                    regionId={item.regionId}
                                    regionName={item.regionName}
                                    durationId={item.durationId}
                                    durationText={item.durationText}
                                    />)}
        </Grid>
        </Container>
        <Container maxWidth='md'>
            <Grid container justifyContent = "center">
                <Pagination count={Math.ceil(activities.total/perPage)} shape="rounded" page={page+1} onChange={changePage} />
            </Grid>
        </Container>
        </>)
};
export default ActivitiesBrowser