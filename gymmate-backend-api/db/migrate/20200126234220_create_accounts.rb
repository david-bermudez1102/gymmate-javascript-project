class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :lastname
      t.string :username
      t.string :email
      t.string :password_digest
      t.date :date_of_birth
      t.float :weight
      t.float :height
      t.float :ibm
      t.text :bio
      t.integer :sex
      t.bigint  :userable_id
      t.string  :userable_type
      t.timestamps
    end
    add_index :accounts, [:userable_type, :userable_id]
  end
end

