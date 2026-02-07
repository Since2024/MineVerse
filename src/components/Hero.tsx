
type HeroProps = {
    title: string

}
function Hero({title}: HeroProps) {
    return (
        <section>
            <h2>{title}</h2>
        </section>
    )
}

export default Hero