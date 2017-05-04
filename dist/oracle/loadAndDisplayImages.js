'use strict';

function loadAndDisplayImages(imgList) {
    var notLoaded = []; //сохраним url, какие не были загружены
    var loaded = []; //сохраним url, какие были загружены
    var promiseImgs = imgList.map(loadImage);

    //вернем результат работы вызова reduce(...) - объект Promise, чтобы можно было потом  при необходимости продолжить цепочку вызовов:
    //loadAndDisplayImages(...).then(...).catch(...);
    return promiseImgs.reduce(function (previousPromise, currentPromise) {
        return previousPromise.then(function () {
            //выполняется этот участок кода, так как previousPromise - в состоянии resolved (= Promise.resolve())
            return currentPromise;
        }).then(function (url) //для "обещаний" в состоянии resolved
        {
            $('#images').append('<img src="' + url + '" style="width: 200px;"/>');
            loaded.push(url);
            return Promise.resolve(url);
        }).catch(function (url) //для "обещаний" в состоянии rejected
        {
            console.log('не удалось загрузить изображение по указанному пути: ', url);
            notLoaded.push(url);
            return Promise.resolve(url);
        });
    }, Promise.resolve()).then(function (lastUrl) {
        console.log('lastUrl:', lastUrl);

        var res = { loaded: loaded, notLoaded: notLoaded };

        //но мы вернем Promise, значение которого будет объект
        return Promise.resolve(res);
    });
}

loadAndDisplayImages(imgList).then(function (loadRes) {
    console.log(loadRes);
}).catch(function (err) {
    console.log(err);
});
//# sourceMappingURL=loadAndDisplayImages.js.map