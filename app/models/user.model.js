//db create table user
module.exports = (sequelize, type) => {
    var User = sequelize.define("user", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: type.STRING,
            allowNull: false
        },
        last_name: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            unique: true,
            type: type.STRING,
            allowNull: false
        },
        username: {
            unique: true,
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        }
    });
    var Course = sequelize.define("course", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            unique: true,
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
    User.hasMany(SE);
    Course.hasMany(SE);
    SE.belongsTo(User);
    SE.belongsTo(Course);
    return {
        user: User,
        course: Course,
        student_enrolled: SE
    };
};