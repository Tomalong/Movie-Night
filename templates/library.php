<div class="window" id="choice"></div>

<table class="table table-striped">
    <thead>
        <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Year</th>
            <th>Director</th>
            <th>Actors</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($library as $item): ?>
            <tr>
                <td id="<?= $item['imdbID'] ?>"><div id="posterContainer"><img alt="poster" id="<?= $item['imdbID'] ?>" class="libraryPoster" src="<?= $item['poster'] ?>"/></div></td>
                <td id="<?= $item['imdbID'] ?>"><?= $item["title"] ?></td>
                <td id="<?= $item['imdbID'] ?>"><?= $item["year"] ?></td>
                <td id="<?= $item['imdbID'] ?>"><?= $item["director"] ?></td>
                <td id="<?= $item['imdbID'] ?>"><?= $item["actors"] ?></td>
            </tr>
        <?php endforeach ?>
    </tbody>
</table>
