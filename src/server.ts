import app from './app';

const server = app.listen(app.get("port"), () => {
    console.log("Running at localhost:%d", app.get("port"));
});

export default server;