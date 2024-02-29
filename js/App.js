const appPresenter = new JPresenter;
const appView = new JView;
const appModel = new JModel;

appPresenter.linkView(appView);
appPresenter.linkModel(appModel);