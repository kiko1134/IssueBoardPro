import {RequestHandler} from 'express';
import db from '../db/models';

const {Column, sequelize} = db;

export default class ColumnController {
    /** GET /api/columns/projectId= — list all columns*/
    static index: RequestHandler = async (req, res, next) => {
        try {
            const where: any = {};
            if (req.query.projectId) where.projectId = Number(req.query.projectId);
            const cols = await Column.findAll({where, order: [['position', 'ASC']]});
            res.json(cols);
        } catch (err) {
            next(err);
        }
    };

    /** GET /api/columns/:id — get single column */
    static show: RequestHandler = async (req, res, next) => {
        try {
            const col = await Column.findByPk(req.params.id);
            if (!col) {
                res.status(404).json({message: 'Column not found'});
                return;
            }
            res.json(col);
        } catch (err) {
            next(err);
        }
    };

    /** POST /api/columns — create column */
    static store: RequestHandler = async (req, res, next) => {
        const {name, projectId} = req.body;
        console.log('Creating column with name:', name, 'and projectId:', projectId);
        if (!name || !projectId) {
            res.status(400).json({message: 'name and projectId are required'});
            return;
        }
        try {
            const max = await Column.max('position', {where: {projectId}}) as number || 0;
            const col = await Column.create({name, projectId, position: max + 1});
            res.status(201).json(col);
        } catch (err) {
            next(err);
        }
    };

    /** PUT /api/columns/:id — update column */
    static update: RequestHandler = async (req, res, next) => {
        try {
            const [updated] = await Column.update(req.body, {where: {id: req.params.id}});
            if (!updated) {
                res.status(404).json({message: 'Column not found'});
                return;
            }
            const col = await Column.findByPk(req.params.id);
            res.json(col);
        } catch (err) {
            next(err);
        }
    };

    /** DELETE /api/columns/:id — delete column */
    static destroy: RequestHandler = async (req, res, next) => {
        try {
            const deleted = await Column.destroy({where: {id: req.params.id}});
            if (!deleted) {
                res.status(404).json({message: 'Column not found'});
                return;
            }
            res.json({message: 'Column deleted'});
        } catch (err) {
            next(err);
        }
    };

    static reorder: RequestHandler = async (req, res, next) => {
        const updates: { id: number; position: number }[] = req.body;
        const t = await sequelize.transaction();
        try {
            await Promise.all(
                updates.map(({ id, position }) =>
                    Column.update(
                        { position },
                        { where: { id }, transaction: t }
                    )
                )
            );
            await t.commit();
            res.json({ message: 'Columns reordered' });
        } catch (err) {
            await t.rollback();
            next(err);
        }
    };
}