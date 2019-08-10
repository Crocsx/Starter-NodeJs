import app from './app';

try {
    const port = Number(process.env.PORT);
    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });
} catch (e) {
    console.log(e);
}