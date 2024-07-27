import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import VehicleLocationModel from '../../model/VehicleLocationModel';
import { fetchLocationData } from '../../service/LocationService';
import { fetchVehicleDataByID } from '../../service/FetchVehicleByID';
import { fetchLocationDataByID } from '../../service/FetchLocationByID';
import { fetchVehicleLocationDataByID } from '../../service/FetchVehicleLocationByID';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { AvailableVehicleResponse } from './components/AvailableVehicleResponse';
import AvailableVehicleV2 from './components/AvailableVehicleV3';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import _ from "lodash";
import VehicleTypeModel from '../../model/VehicleTypeModel';
import { fetchVehicleTypeData } from '../../service/FetchVehicleType';

const SearchVehicleV3 = () => {

}