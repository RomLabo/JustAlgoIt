const appPresenter = new AppPresenter;
const appView = new AppView;
const appModel = new AppModel;

appPresenter.linkView(appView);
appPresenter.linkModel(appModel);