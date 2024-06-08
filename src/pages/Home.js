import Banner from '../components/Banner';
import Footer from '../components/Footer';
import HighlightedProducts from '../components/HighlightedProducts';

export default function Home() {

    const data = {
        title: "GuppyParadaisu",
        content: "From beginners to seasoned aquarist, find everything you need. Craft your underwater masterpiece right here.",
        destination: "/products",
        label: "See What's Available"
    }

    return (
        <>
            <Banner data={data}/>
            <HighlightedProducts />
            <Footer />

        </>
    )
}