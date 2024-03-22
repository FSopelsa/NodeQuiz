<template>
    <div>
        <h1>Welcome to the Results Page</h1>
    </div>
    <button @click="sayHello"> {{ message }}</button>
    <div id="high-score-board">
        <table> <caption>High Scores</caption>
                <tr>
                <th>Pos</th>
                <th>Username</th>
                <th>Date</th> <!-- Date when the quiz was completed -->
                <th>Time</th> 
                <th>Points</th>
                </tr>
                <tr>
                <td>1</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>2</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>3</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>4</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>5</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr class="player">
                <td>6</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>7</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>8</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>9</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ Time }}</td>
                <td>{{ Points }}</td>
                </tr>
                <tr>
                <td>10</td>
                <td>{{ userName }}</td>
                <td>{{ gameDate }}</td>
                <td>{{ time }}</td>
                <td>{{ points }}</td>
                </tr>
            </table>
        </div>
</template>

<script>
export default {
    name: 'ResultsPage',
    data() {
        return {
            message: 'En liten knapp',
        };
    },
    methods: {
        sayHello() {
            alert('Hello from the Results Page');
        },
    },
};
</script>

<style scoped>
/* CSS for Result component */
</style>