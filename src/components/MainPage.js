import { TextField,Typography,Paper,Container,Grid,Divider, IconButton } from "@material-ui/core";
import {Search as SearchIcon} from '@material-ui/icons';
import { useState } from "react";
import useStyles from "../styles";
import { useHistory } from "react-router-dom";

const MainPage = () => {
    const history = useHistory();
    const classes = useStyles();
    const [searchQuery,setSearchQuery] = useState('');
    const doSearch = (e) => {
        history.push(`/search/${searchQuery}`);
        e.preventDefault();
        console.log(searchQuery);
    }

    return (<>
            <Container maxWidth='md'>
          <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
          Main Page
          </Typography>
        </Container>
        <Container maxWidth='md' className={classes.cardGrid} >
            <Grid container spacing={4}>
                <Grid item xs={12}>
                <Typography variant='h6' align='center' color='subtitle1' paragraph>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </Typography>
                </Grid>
            </Grid>
            <Grid container align='center' spacing={4}>
                <Grid item xs={12}>
                <Paper component="form" className={classes.root} onSubmit={doSearch}>
                   <TextField
                    className={classes.input}
                    variant="outlined"
                    size="medium"
                    align="center"
                    label="Search for Activities ..."
                    color="primary"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
                </Paper>

                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                <Typography variant='h6' align='center' color='subtitle1' paragraph>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </Typography>
                </Grid>
            </Grid>

            </Container>

    </>)
};
export default MainPage