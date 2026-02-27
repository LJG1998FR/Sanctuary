import { useAuth } from '@/context/AuthContext';
function Greeting({username}) {

    return <h1 className='ms-4'>Welcome, {username} !</h1>;
}

export default function Home() {
    const {user} = useAuth();
    return <Greeting username={user.data.item.username}/>
}
