import React, { useEffect, } from 'react';
import {
  createStyles, Theme, makeStyles,
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Fab from '@material-ui/core/Fab';
import { useDispatch, useSelector, } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Grid, } from '@material-ui/core';

import {
  getCities, handleChangeArea, addCity, selectCity, clearCity,
} from '../../effects/actions';
import CityModal from './CityModal';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      marginTop: "20px",
      backgroundColor: theme.palette.background.paper,
    },
    fab: { margin: theme.spacing(1), },
    item: { textAlign: "center", },
    add: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

export default React.memo((props: defaultProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const {
    area: {
      cities,
      newCity,
    },
    loading,
  } = useSelector((state: GlobalStore) => ({
    area: state.areaManagement,
    loading: state.notification.loading,
  }));
  
  useEffect(() => {
    props.history.push('city');
    if (!cities.length) {
      dispatch(getCities());
    }
    return () => {
      dispatch(clearCity());
    }
  }, []);
  
  const handleChange = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(handleChangeArea({ key, value: e.target.value, }));
  
  return (
    <Grid container justify="center">
      <form>
        <CityModal/>
        <List
          component="nav"
          className={classes.root}
          aria-label="mailbox folders"
        >
          {cities.map((item: City) => (
            <div key={item.id}>
              <ListItem button onClick={() => dispatch(selectCity(item))}>
                <ListItemText className={classes.item} primary={item.cityName}/>
              </ListItem>
              <Divider light/>
            </div>
          ))}
          <ListItem className={classes.add}>
            <TextField
              label="City"
              autoFocus
              value={newCity}
              disabled={loading}
              onChange={handleChange('newCity')}
            />
            <Fab
              color='primary'
              aria-label='add'
              type='submit'
              className={classes.fab}
              disabled={loading || !newCity}
              onClick={() => dispatch(addCity(newCity))}
            >
              <AddIcon/>
            </Fab>
          </ListItem>
        </List>
      </form>
    </Grid>
  );
});
