//db create table user
module.exports = (sequelize, type) => {
    var User = sequelize.define("user", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: type.STRING,
        last_name: type.STRING,
        email: type.STRING,
        username: {
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        }
    });
    var Course = sequelize.define("student", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        description: {
            type: type.STRING,
            allowNull: false
        },
        available_slots: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false
        },

    });
    var SE = sequelize.define("student_enrolled", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    });
    SE.belongsTo(User);
    SE.belongsTo(Course);
    return {
        user: User,
        course: Course,
        student_enrolled: SE
    };

};