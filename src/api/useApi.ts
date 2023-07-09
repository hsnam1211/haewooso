import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMsg = () =>
  useQuery(
    ['mainMessage'],
    () => { return axios.get('http://15.165.155.62:8080/v1/main_show_msg') },
    {
      onSuccess: (data) => {
        // data로 이것저것 하는 로직
        console.log(data)
      },
      onError: (error) => {
        // error로 이것저것 하는 로직
      }
    }
  );