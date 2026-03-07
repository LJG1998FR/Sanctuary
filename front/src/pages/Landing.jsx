import { useTranslation } from '../hooks/useTranslations';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import Loading from '../components/Loading';
import { apiService } from "@/api/services";

export default function Landing() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        apiService
            .getPreloadAssets()
            .then((res) => {
            if (res.success === true) {
                var data = Object.values(res.data);
                preload(data);
            } else {
                setError("Cannot fetch data.");
            }
            })
            .catch((err) => {
                setError("Error : " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loading/>;
    }
    else {
        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 100);

    }
}

function preload(data) {
    let output = new Promise((resolve, reject) => {
        let counter = 0;
        for (let index = 0; index < data.length; index++) {
            const asset = data[index];
            
            let url = import.meta.env.VITE_API_URL + asset;
            let img = new Image();
            img.onload = () => {
                counter++;
                if(counter == data.length){
                    resolve(true);
                }
            }
            img.onerror = () => {
                counter++;
                if(counter == data.length){
                    resolve(true);
                }
            }
            img.src = url;
            
            var div = document.createElement("div");
            div.style.backgroundImage = "url(" + url + ")";
            document.querySelector("body").appendChild(div);
            
        }
    })

    return output;

}
