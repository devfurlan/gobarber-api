import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export default class AlterAppointments1610932644734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter provider column to provider_id
    await queryRunner.dropColumn('appointments', 'provider');

    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'provider_id',
      type: 'uuid',
      isNullable: true,
    }));

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      name: 'AppointmentProvider',
      columnNames: ['provider_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }));

    // Add created_at and updated_at columns
    await queryRunner.addColumns('appointments', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        default: 'now()',
      }),
      new TableColumn({
          name: 'updated_at',
          type: 'timestamp with time zone',
          default: 'now()',
        },
      )],
    );

    // Change id column type
    await queryRunner.changeColumn('appointments', 'id', new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
    ));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert provider_id column to provider
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    await queryRunner.dropColumn('appointments', 'provider_id');

    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'provider',
      type: 'varchar',
    }));

    // Drop created_at and updated_at columns
    await queryRunner.dropColumn('appointments', 'created_at');
    await queryRunner.dropColumn('appointments', 'updated_at');

    // Revert id column type
    await queryRunner.changeColumn('appointments', 'id', new TableColumn({
        name: 'id',
        type: 'varchar',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
    ));
  }
}
